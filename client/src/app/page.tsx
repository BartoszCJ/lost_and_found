

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
     
      <header className="bg-white border-b border-gray-200 px-8 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Biuro Rzeczy Znalezionych
        </h1>
        <p className="text-gray-600 mt-2 max-w-md text-center">
          Platforma do zarządzania przedmiotami znalezionymi i zgubionymi. Pomagamy łączyć ludzi z ich zgubami.
        </p>
      </header>

      <main className="flex-grow px-8 py-12 sm:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
          
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Przedmioty</h2>
            <p className="text-gray-600 text-sm mb-4">
              Przeglądaj katalog przedmiotów znalezionych i łatwo zidentyfikuj swoją zgubę.
            </p>
            <a
              href="/items"
              className="text-green-600 font-medium hover:underline"
            >
              Zobacz przedmioty →
            </a>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
          
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Zgłoszenia</h2>
            <p className="text-gray-600 text-sm mb-4">
              Zgłoś zagubienie przedmiotu lub sprawdź status swojego zgłoszenia, aby szybciej go odzyskać.
            </p>
            <a
              href="/reports"
              className="text-green-600 font-medium hover:underline"
            >
              Sprawdź zgłoszenia →
            </a>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Panel zarządzania</h2>
            <p className="text-gray-600 text-sm mb-4">
              Dla administratorów: zarządzaj przedmiotami, zgłoszeniami i użytkownikami z poziomu jednego panelu.
            </p>
            <a
              href="/admin-panel"
              className="text-green-600 font-medium hover:underline"
            >
              Przejdź do panelu →
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
