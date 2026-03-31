import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import CONFIG from "../../config/config";

const RegisterEmployee = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendeur");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(CONFIG.API_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          password,
          role,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Employé créé avec succès !");
        setUsername("");
        setPassword("");
        setRole("vendeur");
        setFirstName("");
        setLastName("");
      } else {
        const errorMsg = Object.entries(data)
          .map(([key, val]) => {
            const msg = Array.isArray(val) ? val.join(", ") : val;
            return `${key}: ${msg}`;
          })
          .join(" | ");
        setError(errorMsg || "Erreur lors de la création");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-[#a34ee5]/30">

          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-[#a34ee5] mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Nouvel Employé</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-xl">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Prénom"
              className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Nom"
              className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Nom d'utilisateur (lettres, chiffres, @/./+/-/_)"
              className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
              value={username}
              onChange={(e) => {
                const clean = e.target.value.replace(/[^a-zA-Z0-9@.+\-_]/g, "");
                setUsername(clean);
              }}
              required
            />

            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#a34ee5]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select
              className="w-full p-3 rounded-xl bg-[#41124f]/30 text-white outline-none focus:ring-2 focus:ring-[#a34ee5]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="vendeur">Vendeur</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-[#a34ee5] to-[#fec603] text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer Employé"}
            </button>
          </form>

          <button
            onClick={() => navigate("/dashboardAdmin")}
            className="mt-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Retour
          </button>

        </div>
      </div>
    </div>
  );
};

export default RegisterEmployee;