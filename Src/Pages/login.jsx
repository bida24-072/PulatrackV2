import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTOS, setAcceptedTOS] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!isLogin && !acceptedTOS) return setError("Please accept the Terms & Privacy Policy");
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', res.user.uid), {
          email, country: 'Botswana', acceptedTOS: true, acceptedTOSDate: new Date().toISOString(), createdAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await setDoc(doc(db, 'users', res.user.uid), {
        email: res.user.email, name: res.user.displayName, country: 'Botswana', acceptedTOS: true, createdAt: new Date().toISOString()
      }, { merge: true });
      navigate('/');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-teal-900 mb-4">P</div>
          <h2 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-sm text-gray-500">Track your Pula seamlessly</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleAuth}>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          
          {!isLogin && (
            <div className="flex items-start gap-2 mb-4 text-sm">
              <input type="checkbox" id="tos" className="mt-1" checked={acceptedTOS} onChange={e => setAcceptedTOS(e.target.checked)} />
              <label htmlFor="tos" className="text-gray-600">
                I agree to the <Link to="/terms" className="text-teal-600 underline">Terms</Link> & <Link to="/privacy" className="text-teal-600 underline">Privacy Policy</Link>
              </label>
            </div>
          )}
          
          <Button type="submit" className="mb-3">{isLogin ? 'Sign In' : 'Sign Up'}</Button>
          <Button variant="outline" onClick={handleGoogle} type="button">
            Continue with Google
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-teal-600 font-medium hover:underline">
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </Card>
    </div>
  );
}
