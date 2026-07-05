import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { db } from '../firebase'

import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

export default function AuthorityLogin() {

  const language =
    localStorage.getItem('language') || 'en'

  const navigate = useNavigate()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleLogin = async (e) => {

    e.preventDefault()

    setLoading(true)

    setError('')

    try {

      const q = query(

        collection(db, 'authorities'),

        where('email', '==', email),

        where('password', '==', password)

      )

      const querySnapshot =
        await getDocs(q)

      if (!querySnapshot.empty) {

        localStorage.setItem(
          'authorityLoggedIn',
          'true'
        )

        navigate('/authority')

      } else {

        setError(

          language === 'hi'
            ? 'अमान्य प्राधिकरण लॉगिन विवरण'
            : 'Invalid authority credentials'

        )

      }

    } catch (err) {

      console.log(err)

      setError(

        language === 'hi'
          ? 'लॉगिन विफल'
          : 'Login failed'

      )

    }

    setLoading(false)

  }

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 w-full max-w-md shadow-2xl">

        {/* ICON */}
        <div className="text-7xl text-center mb-8">
          🏛️
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center">

          {language === 'hi'
            ? 'प्राधिकरण लॉगिन'
            : 'Authority Login'}

        </h1>

        {/* SUBTITLE */}
        <p className="text-slate-400 text-center mt-4">

          {language === 'hi'
            ? 'सड़क प्राधिकरणों के लिए सुरक्षित प्रवेश'
            : 'Secure access for road authorities'}

        </p>

        {/* DEMO CREDENTIALS */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mt-8">

          <h2 className="text-yellow-400 font-bold text-lg mb-3">

            {language === 'hi'
              ? 'डेमो क्रेडेंशियल्स'
              : 'Demo Credentials'}

          </h2>

          <p className="text-slate-300">

            {language === 'hi'
              ? 'ईमेल:'
              : 'Email:'}

            <span className="text-green-400 ml-2">

              admin@roadwatch.com

            </span>

          </p>

          <p className="text-slate-300 mt-2">

            {language === 'hi'
              ? 'पासवर्ड:'
              : 'Password:'}

            <span className="text-green-400 ml-2">

              admin123

            </span>

          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-6"
        >

          {/* EMAIL */}
          <div>

            <label className="block text-slate-300 mb-3">

              {language === 'hi'
                ? 'प्राधिकरण ईमेल'
                : 'Authority Email'}

            </label>

            <input
              type="email"
              placeholder={
                language === 'hi'
                  ? 'प्राधिकरण ईमेल दर्ज करें'
                  : 'Enter authority email'
              }
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-500"
              required
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block text-slate-300 mb-3">

              {language === 'hi'
                ? 'पासवर्ड'
                : 'Password'}

            </label>

            <input
              type="password"
              placeholder={
                language === 'hi'
                  ? 'पासवर्ड दर्ज करें'
                  : 'Enter password'
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-yellow-500"
              required
            />

          </div>

          {/* ERROR */}
          {error && (

            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-2xl text-center">

              {error}

            </div>

          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition py-4 rounded-2xl font-bold text-xl text-black"
          >

            {loading
              ? (
                  language === 'hi'
                    ? 'लॉगिन हो रहा है...'
                    : 'Logging in...'
                )
              : (
                  language === 'hi'
                    ? 'लॉगिन करें'
                    : 'Login'
                )}

          </button>

        </form>

      </div>

    </div>

  )

}