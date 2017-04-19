using System.Drawing;

namespace FractalDrawer.Drawers
{
    public interface IDrawer
    {
        void Draw(Bitmap bitmap, Graphics graphics);
        string FileName();
    }
}