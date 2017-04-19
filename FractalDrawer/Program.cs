using FractalDrawer.Drawers;

namespace FractalDrawer
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            var branch2Drawer = new Branch2Drawer(0.75f, 45f, 0.75f);
            var drawManager = new DrawManager(4096);
            drawManager.Draw(branch2Drawer);
        }
    }
}