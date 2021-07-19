import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(request, response) {
  if (request.method === POST) {
    const TOKEN = "48ff93097d219093044268097a0d15";
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "976597", //ID do model de comunidades criado pelo Dato
      ...request.body, //traz as informaçoes do request e lança no body

      //   title: "Sou fã do Hélio",
      //   imageUrl: "https://github.com/hellzz13.png",
      //   creatorSlug: "hellzz13",
    });

    console.log(registroCriado);

    response.json({
      dados: "Algum dado qualquer",
      registroCriado: registroCriado,
    });
    return;
  }

  response.status(404).json({
    message: "Ainda não há nada no GET, mas no POST há",
  });
}
