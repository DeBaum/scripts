using System;
using System.Diagnostics;
using FractalDrawer.Drawers;
using System.Drawing;
using System.IO;

namespace FractalDrawer
{
    public class DrawManager
    {
        private readonly int _resolution;
        private readonly string _outputDir;

        public DrawManager(int resolution)
        {
            _resolution = resolution;
            _outputDir = Directory.GetCurrentDirectory() + @"\render";

            if (!Directory.Exists(_outputDir))
            {
                Directory.CreateDirectory(_outputDir);
            }
        }

        public Bitmap Draw(IDrawer drawer)
        {
            var bitmap = new Bitmap(_resolution * 4 / 3, _resolution);

            var graphics = Graphics.FromImage(bitmap);

            graphics.Clear(Color.White);

            Console.WriteLine("Start Drawing");
            var startNew = Stopwatch.StartNew();
            drawer.Draw(bitmap, graphics);
            startNew.Stop();
            Console.WriteLine("Finished Drawing after " + startNew.Elapsed.ToString(@"mm\:ss\,fff"));

            bitmap.Save(Path.Combine(_outputDir, drawer.FileName() + ".bmp"));

            return bitmap;
        }
    }
}