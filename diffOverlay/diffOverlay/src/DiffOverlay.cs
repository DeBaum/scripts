using System.Drawing;
using System.Drawing.Imaging;
using System.Windows.Forms;

namespace diffOverlay
{
    public class DiffOverlay
    {
        public Bitmap GetDifferenceBitmap(Bitmap bitmap1, Bitmap bitmap2)
        {
            var bounds = new Rectangle(new Point(0, 0), bitmap1.Size);
            var diff = new Bitmap(bitmap1.Width, bitmap1.Height);

            var data1 = bitmap1.LockBits(bounds, ImageLockMode.ReadOnly, bitmap1.PixelFormat);
            var data2 = bitmap1.LockBits(bounds, ImageLockMode.ReadOnly, bitmap2.PixelFormat);
            var diffData = diff.LockBits(bounds, ImageLockMode.WriteOnly, diff.PixelFormat);

            var height = bitmap1.Height;
            var npixels = height * data1.Stride / 4;
            unsafe
            {
                var pPixelsA = (int*) data1.Scan0.ToPointer();
                var pPixelsB = (int*) data2.Scan0.ToPointer();
                var pPixelsDiff = (int*) diffData.Scan0.ToPointer();

                for (var i = 0; i < npixels; ++i)
                {
                    if (pPixelsA[i] != pPixelsB[i])
                    {
                        pPixelsDiff[i] = Color.DeepPink.ToArgb();
                    }
                }
            }
            
            diff.UnlockBits(diffData);

            return diff;
        }
    }
}