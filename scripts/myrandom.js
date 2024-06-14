// Create a Mersenne Twister engine and auto-seed it
var eng = Random.MersenneTwister19937.autoSeed();
var myrandom = new Random.Random(eng);