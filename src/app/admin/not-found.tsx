import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl">{"😕"}</div>
      <h1 className="mt-4 text-2xl font-semibold">{"Page introuvable"}</h1>
      <p className="mt-2 text-sm text-gray-600 max-w-xl">
        {
          " La page demandée est introuvable ou a été déplacée. Vérifiez l'URL ou \
        retournez au tableau de bord."
        }
      </p>

      <div className="mt-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {" Retour au tableau de bord"}
        </Link>
      </div>
    </div>
  );
}
