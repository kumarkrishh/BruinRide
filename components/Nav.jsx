"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const sessionStatus = useMemo(() => {
    return { session, status };
  }, [session, status]);

  return (
    <nav className='flex-between w-full mb-16 pb-3 px-20 pt-3 bg-white shadow-lg'>
      <Link href='/' className='flex gap-2 flex-center'>
        <Image
          src='/assets/images/logo4.png'
          alt='logo'
          width={125}
          height={30}
          className='object-contain'
        />
      </Link>

      {/* Desktop Navigation */}
      <div className='sm:flex hidden'>
        {sessionStatus.session?.user ? (
          <div className='flex gap-3 md:gap-5'>
            <Link href='/chatlist' className='black_btn'>
              Messages
            </Link>
            <Link href='/mynotifications' className='black_btn'>
              Notifications
            </Link>
            <Link href='/my-trips' className='black_btn'>
              My Trips
            </Link>
            <Link href='/create-prompt' className='black_btn'>
              Find RideShares
            </Link>
            <Link href='/create-prompt' className='black_btn'>
              Post Trip
            </Link>

            <button type='button' onClick={signOut} className='outline_btn'>
              Sign Out
            </button>

            <Link href='/edit-profile'>
              <Image
                src={sessionStatus.session.user.image}
                width={37}
                height={37}
                className='rounded-full border border-black'
                alt='profile'
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
        {sessionStatus.session?.user ? (
          <div className='flex'>
            <Image
              src={sessionStatus.session.user.image}
              width={37}
              height={37}
              className='rounded-full'
              alt='profile'
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className='dropdown'>
                <Link
                  href='/profile'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href='/create-prompt'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>

                <button
                  type='button'
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className='mt-5 w-full black_btn'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
