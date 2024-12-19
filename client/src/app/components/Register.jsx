const Register = () => {
  return (
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Nazwa użytkownika"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
      />
      <input
        type="password"
        placeholder="Hasło"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
      />
      <button
        type="submit"
        className="w-full bg-green-300 hover:bg-gray-800 hover:text-green-300 text-gray-800 font-bold border-2 border-gray-700 px-6 py-2 rounded transition duration-300"
      >
        Zarejestruj się
      </button>
    </form>
  );
};
export default Register;
