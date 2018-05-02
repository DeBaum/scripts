using System;
using System.Drawing;
using System.Drawing.Imaging;
using SharpDX;
using SharpDX.Direct3D11;
using SharpDX.DXGI;
using Device = SharpDX.Direct3D11.Device;
using MapFlags = SharpDX.Direct3D11.MapFlags;

namespace diffOverlay
{
    public class ScreenCapturer
    {
        private readonly Device _device;
        private readonly Rectangle _bounds;
        private readonly Texture2D _texture;
        private readonly OutputDuplication _duplicatedOutput;

        public Size DesktopSize
        {
            get { return _bounds.Size; }
        }

        public ScreenCapturer()
        {
            var factory = new Factory1();
            var adapter = factory.GetAdapter1(0);
            _device = new Device(adapter);

            var output = adapter.GetOutput(0);
            var output1 = output.QueryInterface<Output1>();

            _bounds = new Rectangle(
                output.Description.DesktopBounds.Left,
                output.Description.DesktopBounds.Top,
                output.Description.DesktopBounds.Right - output.Description.DesktopBounds.Left,
                output.Description.DesktopBounds.Bottom - output.Description.DesktopBounds.Top
            );

            var texture2DDescription = new Texture2DDescription
            {
                CpuAccessFlags = CpuAccessFlags.Read,
                BindFlags = BindFlags.None,
                Format = Format.B8G8R8A8_UNorm,
                Width = _bounds.Width,
                Height = _bounds.Height,
                OptionFlags = ResourceOptionFlags.None,
                MipLevels = 1,
                ArraySize = 1,
                SampleDescription = {Count = 1, Quality = 0},
                Usage = ResourceUsage.Staging
            };

            _texture = new Texture2D(_device, texture2DDescription);

            _duplicatedOutput = output1.DuplicateOutput(_device);

            CaptureScreen();
        }

        public Bitmap CaptureScreen()
        {
            try
            {
                SharpDX.DXGI.Resource screenResource;
                OutputDuplicateFrameInformation duplicateFrameInformation;

                _duplicatedOutput.AcquireNextFrame(1000, out duplicateFrameInformation, out screenResource);

                using (var screenTexture2D = screenResource.QueryInterface<Texture2D>())
                    _device.ImmediateContext.CopyResource(screenTexture2D, _texture);

                var mapSource =
                    _device.ImmediateContext.MapSubresource(_texture, 0, MapMode.Read, MapFlags.None);

                var bitmap = new Bitmap(_bounds.Width, _bounds.Height, PixelFormat.Format32bppArgb);
                var boundsRect = new Rectangle(0, 0, _bounds.Width, _bounds.Height);

                var mapDest = bitmap.LockBits(boundsRect, ImageLockMode.WriteOnly, bitmap.PixelFormat);
                var sourcePtr = mapSource.DataPointer;
                var destPtr = mapDest.Scan0;
                for (var y = 0; y < _bounds.Height; y++)
                {
                    Utilities.CopyMemory(destPtr, sourcePtr, _bounds.Width * 4);
                    sourcePtr = IntPtr.Add(sourcePtr, mapSource.RowPitch);
                    destPtr = IntPtr.Add(destPtr, mapDest.Stride);
                }

                bitmap.UnlockBits(mapDest);
                _device.ImmediateContext.UnmapSubresource(_texture, 0);

                screenResource.Dispose();
                _duplicatedOutput.ReleaseFrame();
                return bitmap;
            }
            catch (SharpDXException e)
            {
                if (e.ResultCode.Code != SharpDX.DXGI.ResultCode.WaitTimeout.Result.Code)
                {
                    throw e;
                }
            }

            return null;
        }
    }
}