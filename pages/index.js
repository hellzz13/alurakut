import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import React from "react";

function ProfileSideBar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a
                href={`https://github.com/${itemAtual}.png`}
                key={itemAtual.title}
              >
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          );
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

// Aqui rendezira a app em sí
export default function Home() {
  const githubUser = "hellzz13";
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    // "DaniSan0508-project",
    "juunegreiros",
    "omariosouto",
    "peas",
    "rafaballerini",
    "marcobrunodev",
    "felipefialho",
  ];
  // useState dos seguidores foi criado
  const [seguidores, setSeguidores] = React.useState([]);
  // useEffect coloca um limite de acesso pra API, para monitorar e não sobrecarregar no state
  React.useEffect(function () {
    // API do github
    fetch("https://api.github.com/users/hellzz13/followers")
      .then(function (resp) {
        return resp.json();
      })
      .then(function (respComplete) {
        setSeguidores(respComplete);
      });

    // API graphQL
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "9fc6fcf516cbc7102a713198dcc434",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
          allComunnities{
            title
            imageUrl
            id
            creatorSlug
          }
        }`,
      }),
    })
      .then((response) => response.json()) //com retorno direto arrow function
      .then((respostaCompleta) => {
        const comunidadesDato = respostaCompleta.data.allComunnities;
        setComunidades(comunidadesDato);
        console.log(comunidadesDato);
      });
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          {/* propriedade githubuser que recebe a variavel githubuser */}
          <ProfileSideBar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);
                console.log("Campo: ", dadosDoForm.get("title"));
                console.log("Campo: ", dadosDoForm.get("image"));

                const comunidade = {
                  title: dadosDoForm.get("title"),
                  imageUrl: dadosDoForm.get("image"),
                  creatorSlug: githubUser,
                };

                fetch("/api/comunidades", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                });
              }}
            >
              <div>
                <input
                  placeholder="O que você deseja fazer?"
                  name="title"
                  area-label="O que você deseja fazer?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usar de capa"
                  name="image"
                  area-label="Coloque uma URL para usar de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title="Seguidores " items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  //verificar esse id
                  <li key={itemAtual.id}>
                    <a
                      href={`/comunities/${itemAtual.id}`}
                      key={itemAtual.title}
                    >
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
