export const dynamic = "force-static";

import Image from "next/image";
import Link from "next/link";
import RegisterFormComponent from "./RegisterFrom";

function RegisterForm() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="h-full w-2/3 bg-[#ffd21d] flex items-center justify-center">
        <Image
          src="/cart.svg"
          draggable={false}
          alt="Register Image"
          height={400}
          unoptimized
          width={400}
          loading="eager"
          className="h-3/4 w-3/4 select-none"
        />
      </div>
      <div className="h-full w-1/3 bg-white flex items-start justify-start pt-10 pb-5 flex-col px-8 gap-8 overflow-y-scroll">
        <div className="inline-flex h-20 overflow-hidden text-5xl font-bold">
          <span className="flex items-center bg-green-700 border-r-0 px-3 text-[#fbca49]">
            jhat
          </span>
          <span className="flex items-center bg-[#fbca49] px-3 text-green-700">
            pat
          </span>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-3">
          <p className="text-green-700 text-2xl font-semibold">
            Create your account
          </p>
          <Link href="/login" className="font-semibold text-lg">
            Already have an account?{" "}
            <span className="text-blue-700 underline">Log in now</span>
          </Link>
        </div>
        <RegisterFormComponent />
      </div>
    </div>
  );
}

export default RegisterForm;
