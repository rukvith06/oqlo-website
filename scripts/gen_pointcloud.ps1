Add-Type -AssemblyName System.Drawing

$srcPath = "assets/constn_mesh.png"
$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $srcBmp.Width
$h = $srcBmp.Height

$dstBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$srcData = $srcBmp.LockBits([System.Drawing.Rectangle]::new(0, 0, $w, $h), [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dstData = $dstBmp.LockBits([System.Drawing.Rectangle]::new(0, 0, $w, $h), [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$stride = $srcData.Stride
$bytes = New-Object byte[] ($stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytes.Length)

$dstBytes = New-Object byte[] ($stride * $h)
# Start with dark UI background
for ($i = 0; $i -lt $dstBytes.Length; $i += 4) {
    $dstBytes[$i] = 11      # B
    $dstBytes[$i + 1] = 15  # G
    $dstBytes[$i + 2] = 18  # R
    $dstBytes[$i + 3] = 255 # A
}

# Copy UI chrome verbatim (Header y < 135, Sidebar x < 322, Bottom y > 825)
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $isChrome = ($y -lt 135) -or ($x -lt 322) -or ($y -gt 825)
        if ($isChrome) {
            $idx = ($y * $stride) + ($x * 4)
            $dstBytes[$idx] = $bytes[$idx]
            $dstBytes[$idx + 1] = $bytes[$idx + 1]
            $dstBytes[$idx + 2] = $bytes[$idx + 2]
            $dstBytes[$idx + 3] = 255
        }
    }
}

# In bottom pill, change 'Mesh View' text / pill to 'Point Cloud View' if applicable (already done in constn_pointcloud.png)
# So let's load UI bottom bar from constn_pointcloud.png so it says "Point Cloud View"!
$pcBmp = [System.Drawing.Bitmap]::FromFile("assets/constn_pointcloud.png")
$pcData = $pcBmp.LockBits([System.Drawing.Rectangle]::new(0, 825, $w, $h - 825), [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$pcBytes = New-Object byte[] ($stride * ($h - 825))
[System.Runtime.InteropServices.Marshal]::Copy($pcData.Scan0, $pcBytes, 0, $pcBytes.Length)
for ($y = 825; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $dstIdx = ($y * $stride) + ($x * 4)
        $srcIdx = (($y - 825) * $stride) + ($x * 4)
        $dstBytes[$dstIdx] = $pcBytes[$srcIdx]
        $dstBytes[$dstIdx + 1] = $pcBytes[$srcIdx + 1]
        $dstBytes[$dstIdx + 2] = $pcBytes[$srcIdx + 2]
        $dstBytes[$dstIdx + 3] = 255
    }
}
$pcBmp.UnlockBits($pcData)
$pcBmp.Dispose()

# Now create authentic discrete 3D LiDAR Point Cloud points:
# A true point cloud has distinct laser scan dots on a dense 3px lattice.
# Building points: Electric cyan / LiDAR laser intensity (elevated structures glow like LiDAR returns)
# Ground / vegetation: Natural discrete point stipples
for ($y = 135; $y -lt 825; $y += 3) {
    for ($x = 325; $x -lt 1910; $x += 3) {
        $idx = ($y * $stride) + ($x * 4)
        $b = $bytes[$idx]
        $g = $bytes[$idx + 1]
        $r = $bytes[$idx + 2]

        $brightness = [Math]::Max($r, [Math]::Max($g, $b))
        if ($brightness -lt 28) { continue }

        $diffRG = [Math]::Abs($r - $g)
        $diffGB = [Math]::Abs($g - $b)
        $isBuilding = ($r -gt 65 -and $diffRG -lt 28 -and $diffGB -lt 28)

        # 2x2 dot for each point
        for ($dy = 0; $dy -lt 2; $dy++) {
            for ($dx = 0; $dx -lt 2; $dx++) {
                $py = $y + $dy
                $px = $x + $dx
                if ($py -lt 825 -and $px -lt 1910) {
                    $pIdx = ($py * $stride) + ($px * 4)
                    if ($isBuilding) {
                        # LiDAR Intensity Color (Cyan / Laser Blue / White Highlights)
                        # Roof vs wall height
                        $dstBytes[$pIdx] = [Math]::Min(255, [int]($b * 1.35 + 85))       # Bright Cyan-Blue
                        $dstBytes[$pIdx + 1] = [Math]::Min(255, [int]($g * 1.25 + 65))   # Cyan-Green
                        $dstBytes[$pIdx + 2] = [Math]::Min(255, [int]($r * 0.75 + 15))   # Subtle Red
                        $dstBytes[$pIdx + 3] = 255
                    } else {
                        # Natural terrain points with crisp laser saturation
                        $dstBytes[$pIdx] = [Math]::Min(255, [int]($b * 1.15))
                        $dstBytes[$pIdx + 1] = [Math]::Min(255, [int]($g * 1.25))
                        $dstBytes[$pIdx + 2] = [Math]::Min(255, [int]($r * 1.1))
                        $dstBytes[$pIdx + 3] = 255
                    }
                }
            }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstBytes, 0, $dstData.Scan0, $dstBytes.Length)
$srcBmp.UnlockBits($srcData)
$dstBmp.UnlockBits($dstData)

# Save backup of raw point cloud
if (-not (Test-Path "assets/constn_pointcloud_raw.png")) {
    Copy-Item "assets/constn_pointcloud.png" "assets/constn_pointcloud_raw.png"
}

$dstBmp.Save("assets/constn_pointcloud.png", [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Save("assets/constn_pointcloud_styled.png", [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Dispose()
$srcBmp.Dispose()

Write-Host "Updated assets/constn_pointcloud.png with crisp LiDAR points"
