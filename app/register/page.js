"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarGenerator } from "random-avatar-generator";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();

  const generateRandomAvatar = () => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  };

  const handleRefreshAvatar = () => {
    setAvatarUrl(generateRandomAvatar());
  };

  useEffect(() => {
    setAvatarUrl(generateRandomAvatar());
  }, []);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Es necesario escribir un nombre";
    }
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Email es invalido!";
    }

    if (password.length < 6) {
      newErrors.password = "El password tiene que tener al menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Los passwords no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        name,
        email,
        avatarUrl,
      });
      router.push("/");
      setErrors({});
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center flex-col space-y-2 justify-between border border-gray-200 p-2 overflow-y-auto">
      {/*form*/}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-2x1 shadow-jg p-10"
      >
        <h1 className="text-xl text-center font-semibold text-[#0b3a65ff]">
          WhatNews<span className="font-bold text-[#eeab63ff]">Chat</span>
        </h1>

        {/*mostrar el avatar */}
        <div className="flex items-center flex-col space-y-2 justify-between border border-gray-200 p-2">
          <img src={avatarUrl} rounded-full h-10 w-10 alt="avatar" />
          <button
            onClick={handleRefreshAvatar}
            type="button"
            className="btn btn-outline bg-blue-900 text-white"
          >
            Otro Avatar
          </button>
        </div>

        {/*Nombre*/}
        <div className="flex justify-center flex-col">
          <label className="text-base label-text">
            Tu nombre
            <span />
          </label>
          <input
            type="text"
            placeholder="¿Cómo te llamas?"
            className="input input-bordered w-full max-w-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name}</span>
          )}
        </div>

        {/*email*/}
        <div className="flex justify-center flex-col">
          <label className="text-base label-text">
            Tu correo
            <span />
          </label>
          <input
            type="email"
            placeholder="¿Cuál es tu correo?"
            className="input input-bordered w-full max-w-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>

        {/*Password*/}
        <div className="flex justify-center flex-col">
          <label className="text-base label-text">
            Password
            <span />
          </label>
          <input
            type="password"
            placeholder="Ahora que nadie te ve, pon tu password"
            className="input input-bordered w-full max-w-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          {errors.password && (
            <span className="text-sm text-red-500">{errors.password}</span>
          )}
        </div>

        {/*confirmar password*/}
        <div className="flex justify-center flex-col">
          <label className="text-base label-text">
            Confirma password
            <span />
          </label>
          <input
            type="password"
            placeholder="confirma tu password, por las dudas"
            className="input input-bordered w-full max-w-xs"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-block bg-[#0b3a65ff] text-white"
          >
            {loading ? (
              <span className="loading loading-infinity loading-lg"></span>
            ) : (
              "registrar"
            )}
          </button>
        </div>

        <span>
          {" "}
          ¿Ya tienes una cuenta con nosotros?{""}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}

export default page;
