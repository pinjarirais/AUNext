"use server"
import loginImg from '/public/images/walk_bank_facility.webp';
import logoImg from '/public/images/AU-Bank-logo.png';
import Image from 'next/image';
import LoginWrapper from '@/component/login/loginWrapper';



export default async function Home() {
    return (
      <>
        <div className="flex flex-col md:flex-row h-[100vh]">
          <div className="bgImg w-full md:w-1/2 bg-[#6d3078] hidden md:flex">
            <Image
              className="self-center justify-self-center m-auto"
              src={loginImg}
              alt="loginimg"
            />
          </div>
          <div className="login-form w-full md:w-1/2 p-5">
          <div className='form-wrapp mx-auto md:mx-5 sm:w-full sm:max-w-sm'>
            <div className='logo-wrap'>
              <Image src={logoImg} className='w-[120px] mx-auto md:mx-0' alt="logo" />
            </div>

              <LoginWrapper />
            
            </div>
          </div>
        </div>
      </>
    );
}
