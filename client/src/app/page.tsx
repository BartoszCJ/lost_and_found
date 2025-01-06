"use client";
import Image from "next/image";
import CustomButton from "./components/CustomButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Biuro Rzeczy Znalezionych
        </h1>
        <p className="text-gray-600 mt-2 max-w-md text-center">
          Platforma do zarządzania przedmiotami znalezionymi i zgubionymi.
          Pomagamy łączyć ludzi z ich zgubami.
        </p>
      </header>

      <main className="flex-grow px-8 py-12 sm:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl hover:bg-gray-100 transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Przedmioty
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Przeglądaj katalog przedmiotów znalezionych i łatwo zidentyfikuj
              swoją zgubę.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl hover:bg-gray-100 transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Zgłoszenia
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Zgłoś zagubienie przedmiotu lub sprawdź status swojego zgłoszenia,
              aby szybciej go odzyskać.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl hover:bg-gray-100 transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Panel zarządzania
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Dla administratorów: zarządzaj przedmiotami, zgłoszeniami i
              użytkownikami z poziomu jednego panelu.
            </p>
          </div>
        </div>
      </main>

      <section className="bg-white shadow-md rounded-lg mt-12 pb-10 pt-10 mx-28 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Działamy na terenie naszego kampusu
        </h2>
        <p className="text-gray-600 text-center max-w-lg mb-6">
          Oferujemy usługi na rzecz naszej społeczności, zapewniając szybki
          dostęp do informacji o znalezionych i zgubionych przedmiotach.
        </p>
        <Image
          src="/assets/images/kampus.jpg"
          alt="Mapa kampusu"
          width={600}
          height={400}
          className="rounded-lg shadow"
        />
      </section>
      <section className="mt-12 px-8 py-12 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Nasza Społeczność
          </h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Wierzymy, że zgubione przedmioty odnajdują swoich właścicieli dzięki
            współpracy i wzajemnej pomocy.
          </p>
          <div className="w-[50%] mx-auto">
            <CustomButton
              onClick={handleRedirect}
              title={"Dołącz do nas!"}
              textVariant="default"
              className=""
            />
          </div>
        </div>
      </section>
    </div>
  );
}
