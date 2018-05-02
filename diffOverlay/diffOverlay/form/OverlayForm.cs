using System.Drawing;
using System.Windows.Forms;

namespace diffOverlay.form
{
    public class OverlayForm : Form
    {
        private Bitmap _screenshot;
        private readonly ScreenCapturer _screenCapturer;

        public OverlayForm()
        {
            _screenCapturer = new ScreenCapturer();
            
            TopMost = true; // make the form always on top
            FormBorderStyle = FormBorderStyle.None; // hidden border
            WindowState = FormWindowState.Maximized; // maximized
            MinimizeBox = MaximizeBox = false; // not allowed to be minimized
            Size = _screenCapturer.DesktopSize;
            MinimumSize = MaximumSize = Size; // not allowed to be resized
            TransparencyKey = BackColor = Color.Red; // the color key to transparent, choose a color that you don't use
            Opacity = 0.5d;
            _captureScreenshot();
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams cp = base.CreateParams;
                // Set the form click-through
                cp.ExStyle |= 0x80000 /* WS_EX_LAYERED */ | 0x20 /* WS_EX_TRANSPARENT */;
                return cp;
            }
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            // draw what you want
            if (_screenshot != null)
            {
                e.Graphics.DrawImage(_screenshot, new Point(0, 0));
            }
        }

        void _captureScreenshot()
        {
            _screenshot = _screenCapturer.CaptureScreen();
        }
    }
}