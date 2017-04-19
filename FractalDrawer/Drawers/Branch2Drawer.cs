using System;
using System.Drawing;

namespace FractalDrawer.Drawers
{
    public class Branch2Drawer : IDrawer
    {
        private readonly double _shortening;
        private readonly double _angle;
        private readonly double _balance;
        private readonly Pen _pen;

        public Branch2Drawer(float shortening, float angle, float balance)
        {
            _shortening = shortening;
            _angle = Math.PI * angle / 180;
            _balance = balance;
            _pen = new Pen(Color.Black, 1f);
        }

        public string FileName()
        {
            return String.Format("2-branch-{0:0.0}len-{1:0}deg-{2:0.0}bal",
                _shortening, _angle * 180 / Math.PI, _balance);
        }

        public void Draw(Bitmap bitmap, Graphics graphics)
        {
            var startPoint = new Point(bitmap.Width / 2, bitmap.Height);
            var length = 0.22 * bitmap.Height;
            var endPoint = new Point(startPoint.X, (int) (startPoint.Y - length));

            graphics.DrawLine(_pen, startPoint, endPoint);
            DrawBranches(graphics, endPoint, Math.PI * 1.5, length * _shortening);
        }

        private void DrawBranches(Graphics graphics, Point startPoint, double rootAngle, double length)
        {
            if (length < 2) return;

            var leftAngle = rootAngle - _balance * _angle;
            var rightAngle = rootAngle + (1 - _balance) * _angle;

            var endPointL = new Point(
                startPoint.X + (int) (Math.Cos(leftAngle) * length),
                startPoint.Y + (int) (Math.Sin(leftAngle) * length));

            var endPointR = new Point(
                startPoint.X + (int) (Math.Cos(rightAngle) * length),
                startPoint.Y + (int) (Math.Sin(rightAngle) * length));

            graphics.DrawLine(_pen, startPoint, endPointL);
            graphics.DrawLine(_pen, startPoint, endPointR);

            DrawBranches(graphics, endPointL, leftAngle, length * _shortening);
            DrawBranches(graphics, endPointR, rightAngle, length * _shortening);
        }
    }
}