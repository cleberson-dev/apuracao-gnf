exports.seed = function(knex) {
  return knex("candidate")
    .del()
    .then(function() {
      return knex("candidate").insert([
        {
          numero: 22,
          nome: "Fernando PL",
          cor: "#274696",
          perfil:
            "https://divulgacandcontas.tse.jus.br/candidaturas/oficial/2020/MA/07668/426/candidatos/540443/foto.JPG",
        },
        {
          numero: 40,
          nome: "Josimar da Serraria",
          cor: "#FFB800",
          perfil:
            "https://divulgacandcontas.tse.jus.br/candidaturas/oficial/2020/MA/07668/426/candidatos/613847/foto.jpg",
        },
        {
          numero: 77,
          nome: "Dra. Regina",
          cor: "#F37037",
          perfil:
            "https://divulgacandcontas.tse.jus.br/candidaturas/oficial/2020/MA/07668/426/candidatos/313496/foto.jpeg",
        },
        {
          numero: 27,
          nome: "Dr. Haroldo",
          cor: "#0065CB",
          perfil:
            "https://divulgacandcontas.tse.jus.br/candidaturas/oficial/2020/MA/07668/426/candidatos/619887/foto.jpg",
        },
        {
          numero: 0,
          nome: "Outros",
          cor: "#2A9D8F",
        },
      ]);
    });
};
