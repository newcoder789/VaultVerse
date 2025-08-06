import 'boxicons/css/boxicons.min.css';
import Spline from '@splinetool/react-spline';


const Hero = () => {
  return (
    <main className="flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)]">
      <div data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"className="max-w-xl ml-[5%] px-10 mt-[90%] md:mt-[60%] lg:mt-0">
        {/* Tag box with gradient border */}
        <div className="relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-[#656565] to-[#6464dc] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full">
          <div className="absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1">
            <i className="bx bx-diamond"></i>
            <span>INTRODUCING</span>
          </div>
        </div>
      
      {/*main heading */}
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight my-8 text-white">
  <span className="whitespace-nowrap">VAULTIC PROTOCOL</span>{' '}
  <span>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700">Smart</span>{' '}
    Loans for{' '}
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700">Web3</span>
  </span>
</h1>

<p className="text-lg sm:text-xl tracking-wide text-gray-400 max-w-[28rem] mt-4">
  Borrow and lend securely on-chain, with no middleman.<br />
  Built on Internet Computer using <span className="text-white font-semibold">Motoko</span>.
</p>
      {/* Buttons */}
        <div className='flex justify-center lg:justify-start gap-4 mt-5'>
          {/* LOAN Button (Outline style) */}
          <a
            className='
              px-6 py-3 rounded-full text-lg font-semibold tracking-wider
              border border-purple-500 text-purple-400
              hover:bg-purple-900 hover:bg-opacity-30
              transition-all duration-300
              flex items-center gap-2
            '
            href='#'
          >
            LOAN <i className='bx bx-link'></i>
          </a>

          {/* LEND Button (Gradient fill) */}
          <a
            className='
              px-6 py-3 rounded-full text-lg font-semibold tracking-wider
              bg-gradient-to-r from-purple-600 to-pink-600 text-white
              shadow-lg hover:shadow-xl hover:scale-105
              transition-all duration-300
              flex items-center gap-2
            '
            href='#'
          >
            LEND <i className='bx bx-link'></i>
          </a>
        </div>
      </div>
      {/*3d model */}
      <Spline data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-delay="300"
        data-aos-offset="0" data-aos-duration="3000"
        style={{ transform: 'scale(1.5)' }} 
         className='absolute lg:top-0 top-[-20%] bottom-0 lg:left-[20%] sm:left-[-2%]' /*scene="https://prod.spline.design/8qjNcB0Abb5PbyP8/scene.splinecode"*/scene="https://prod.spline.design/Nq4APvw3G46E0Ufa/scene.splinecode" />
        
    </main>
  );
};

export default Hero;
