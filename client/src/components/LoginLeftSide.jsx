const LoginLeftSide = () => {
  return (
    <section className="relative hidden min-h-screen w-1/2 overflow-hidden bg-indigo-950 md:flex">
      <div className="absolute -left-30 -top-30 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute left-2 top-5 flex h-8 w-14 items-center rounded-full bg-slate-200 p-1">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg font-bold leading-none text-slate-950 ring-2 ring-sky-400">
          S
        </span>
      </div>
      <div className="relative z-10 flex h-screen w-full flex-col items-start justify-center px-12 lg:px-[72px]">
        <h1 className="mb-6 text-4xl font-medium leading-tight tracking-tight text-white lg:text-5xl">
          Employee
          <br />
          Management System
        </h1>
        <p className="max-w-md text-base leading-relaxed text-slate-400">
          Streamline your workforce operations, track attendance, manage payroll,
          and empower your team securely.
        </p>
      </div>
    </section>
  );
};

export default LoginLeftSide;
