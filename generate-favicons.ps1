Add-Type -AssemblyName System.Drawing

function Generate-FaviconBitmap([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # 1. Rounded Squircle Background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $radius = [int]($size * 0.26)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2

    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($size - $d - 1, 0, $d, $d, 270, 90)
    $path.AddArc($size - $d - 1, $size - $d - 1, $d, $d, 0, 90)
    $path.AddArc(0, $size - $d - 1, $d, $d, 90, 90)
    $path.CloseFigure()

    $teal1 = [System.Drawing.Color]::FromArgb(255, 15, 118, 110)
    $teal2 = [System.Drawing.Color]::FromArgb(255, 6, 78, 59)
    $brushBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF(0, 0)),
        (New-Object System.Drawing.PointF($size, $size)),
        $teal1, $teal2
    )
    $g.FillPath($brushBg, $path)

    # Subtle border highlight
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), [float]($size * 0.025))
    $g.DrawPath($borderPen, $path)

    # 2. Draw Bag Handle
    $penHandleWidth = [float]($size * 0.075)
    $mintColor = [System.Drawing.Color]::FromArgb(255, 52, 211, 153)
    $penHandle = New-Object System.Drawing.Pen($mintColor, $penHandleWidth)
    $penHandle.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penHandle.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $handleX = [int]($size * 0.35)
    $handleY = [int]($size * 0.18)
    $handleW = [int]($size * 0.30)
    $handleH = [int]($size * 0.22)
    $g.DrawArc($penHandle, $handleX, $handleY, $handleW, $handleH, 180, 180)

    # 3. Draw Shopping Bag Body
    $penBody = New-Object System.Drawing.Pen($mintColor, $penHandleWidth)
    $penBody.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $p1 = New-Object System.Drawing.PointF([float]($size * 0.22), [float]($size * 0.34))
    $p2 = New-Object System.Drawing.PointF([float]($size * 0.78), [float]($size * 0.34))
    $p3 = New-Object System.Drawing.PointF([float]($size * 0.73), [float]($size * 0.82))
    $p4 = New-Object System.Drawing.PointF([float]($size * 0.27), [float]($size * 0.82))
    $bagPts = [System.Drawing.PointF[]]@($p1, $p2, $p3, $p4)
    $g.DrawPolygon($penBody, $bagPts)

    # 4. Urban 'U' monogram in center of bag
    $uPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $penU = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 167, 243, 208), [float]($size * 0.07))
    $penU.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penU.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $uLeft = [float]($size * 0.40)
    $uRight = [float]($size * 0.60)
    $uTop = [float]($size * 0.47)
    $uBottom = [float]($size * 0.64)
    $uRadius = [float](($uRight - $uLeft) / 2)

    $uPath.AddLine($uLeft, $uTop, $uLeft, $uBottom)
    $uPath.AddArc($uLeft, [float]($uBottom - $uRadius), [float]($uRadius * 2), [float]($uRadius * 2), 180, -180)
    $uPath.AddLine($uRight, $uBottom, $uRight, $uTop)
    $g.DrawPath($penU, $uPath)

    # 5. Golden Spark / Star Accent (Top Right)
    $sparkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
    $cx = [float]($size * 0.80)
    $cy = [float]($size * 0.20)
    $sr = [float]($size * 0.09)
    $ir = [float]($size * 0.035)

    $starPts = [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF($cx, ($cy - $sr))),
        (New-Object System.Drawing.PointF(($cx + $ir), ($cy - $ir))),
        (New-Object System.Drawing.PointF(($cx + $sr), $cy)),
        (New-Object System.Drawing.PointF(($cx + $ir), ($cy + $ir))),
        (New-Object System.Drawing.PointF($cx, ($cy + $sr))),
        (New-Object System.Drawing.PointF(($cx - $ir), ($cy + $ir))),
        (New-Object System.Drawing.PointF(($cx - $sr), $cy)),
        (New-Object System.Drawing.PointF(($cx - $ir), ($cy - $ir)))
    )
    $g.FillPolygon($sparkBrush, $starPts)

    $g.Dispose()
    return $bmp
}

# Generate PNGs
$bmp192 = Generate-FaviconBitmap 192
$bmp192.Save("$PSScriptRoot\images\favicon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp192.Save("$PSScriptRoot\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp192.Dispose()

$bmp32 = Generate-FaviconBitmap 32
$bmp32.Save("$PSScriptRoot\images\favicon-32.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Generate multi-icon ICO (16, 32, 48)
$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)

# Header: reserved (0), type (1 for ico), count (3)
$bw.Write([uint16]0)
$bw.Write([uint16]1)
$bw.Write([uint16]3)

$sizes = @(16, 32, 48)
$pngBytesList = @()

foreach ($s in $sizes) {
    $b = Generate-FaviconBitmap $s
    $pms = New-Object System.IO.MemoryStream
    $b.Save($pms, [System.Drawing.Imaging.ImageFormat]::Png)
    $b.Dispose()
    $pngBytesList += ,$pms.ToArray()
}

$offset = 6 + (16 * $sizes.Count)
for ($i = 0; $i -lt $sizes.Count; $i++) {
    $s = $sizes[$i]
    $data = $pngBytesList[$i]
    $bw.Write([byte]$s) # width
    $bw.Write([byte]$s) # height
    $bw.Write([byte]0)  # color count
    $bw.Write([byte]0)  # reserved
    $bw.Write([uint16]1) # color planes
    $bw.Write([uint16]32) # bpp
    $bw.Write([uint32]$data.Length) # data length
    $bw.Write([uint32]$offset) # data offset
    $offset += $data.Length
}

for ($i = 0; $i -lt $sizes.Count; $i++) {
    $bw.Write($pngBytesList[$i])
}

$bmp32.Dispose()
[System.IO.File]::WriteAllBytes("$PSScriptRoot\favicon.ico", $ms.ToArray())
$bw.Close()
$ms.Close()

Write-Output "Favicon assets successfully created!"
