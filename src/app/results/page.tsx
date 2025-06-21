'use client';

import Link from "next/link";
import { useContext } from "react";
import { UserContext } from '@/contexts/UserContext';

export default function Results () {
  /**
   * Use context to get user data process on the server
   */
  const { userData } = useContext(UserContext);

  return (
    <div className="m-results flex h-screen">
      <div className="m-results__pane-strip relative">
        <div className="m-results__pane-strip__grid absolute"></div>
      </div>
      <main className="m-results__main mt-20">
        <h1 className="text-7xl">OneWay Inc.</h1>
        <p className="text-2xl">Results...</p>

        <p className="mt-8"><b>Hi</b>, {userData?.fullName || 'Loading'}</p>
        <p><b>Age</b>, {userData?.age || 'Loading'}</p>

        <p className="my-8"><b>PDF contents below</b></p>

        <p className="w-2/4">
          {userData?.text || 'Loading'}
        </p>

        <Link href="/">
          <button className="btn btn--primary mt-8">Go back</button>
        </Link>
      </main>
    </div>
  )
}
