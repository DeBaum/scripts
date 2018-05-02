using System;
using System.Windows.Forms;
using diffOverlay.form;

namespace diffOverlay
{
    internal class Program
    {
        [STAThread]
        public static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.Run(new OverlayForm());
        }
    }
}