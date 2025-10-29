const express = require('express');
const app = express();

app.use(express.json());

let livros = [];
let resenhas = [];

app.get('/', (req, res) => {
    res.send('Bem vindo ao This Sucks!, um sistema de cadastro e resenha de livros vampirescos');
});

app.post('/livros', (req, res) => {
	const { nome, autor, idioma_original, editora, edicao, data_publicacao, resumo } = req.body;
	if (!nome || !autor || !idioma_original || !editora || !edicao || !data_publicacao || !resumo) {
		return res.status(400).send('Todos os campos são obrigatórios: nome, autor, idioma_original, editora, edicao, data_publicacao, resumo');
	}else{
		livros.push({ nome, autor, idioma_original, editora, edicao, data_publicacao, resumo });
		res.send('Livro adicionado')
	};
});

app.get('/livros', (req, res) => {
	res.send(livros);
});

app.get('/livros/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const livro = livros[id - 1];
	if (livro) {
		res.send(livro);
	} else {
		res.send('Livro não encontrado');
	}
});

app.put('/livros/:id', (req, res) => {
	const id = parseInt(req.params.id);
	if (livros[id - 1]) {
		livros[id - 1] = req.body;
		res.send('Livro atualizado');
	} else {
		res.send('Livro não encontrado');
	}
});

app.delete('/livros/:id', (req, res) => {
	const id = parseInt(req.params.id);
	if (Number.isNaN(id) || id < 1 || id > livros.length) return res.status(400).json({ erro: 'ID inválido' });
	if (!livros[id - 1]) return res.status(404).json({ erro: 'Livro não encontrado' });
	livros.splice(id - 1, 1);
	res.status(204).send();
});

app.post('/livros/:id/resenhas', (req, res) => {
	const { titulo, avaliacao, data_postagem, descricao } = req.body;
	if (!titulo|| !avaliacao || !data_postagem || !descricao ) {
		return res.status(400).send('Todos os campos são obrigatórios: título, avaliação, data de postagem, descrição');
	}else{
		resenhas.push({ livroId: parseInt(req.params.id), ...req.body });
		res.send('Resenha adicionada')
	};
});

app.get('/livros/:id/resenhas', (req, res) => {
	const livroId = parseInt(req.params.id);
	const filtro = resenhas.filter(r => r.livroId === livroId);
	res.send(filtro);
});

app.get('/resenhas/:id', (req, res) => {
	const id = parseInt(req.params.id);
	if (Number.isNaN(id) || id < 1) {
		return res.status(400).json({ erro: 'ID inválido' });
	}
	const resenha = resenhas[id - 1];
	if (resenha) {
		return res.json(resenha);
	}

	return res.status(404).json({ erro: 'Resenha não encontrada' });
});

app.put('/resenhas/:id', (req, res) => {
	const id = parseInt(req.params.id);
	if (resenhas[id - 1]) {
		resenhas[id - 1] = req.body;
		res.send('resenha atualizada');
	} else {
		res.send('resenha não encontrada');
	}
});

app.delete('/resenhas/:id', (req, res) => {
	const id = parseInt(req.params.id);
	if (Number.isNaN(id) || id < 1 || id > resenhas.length){
		return res.status(400).json({ erro: 'ID de resenha inválido' })
	};
	if (!resenhas[id - 1]){
		return res.status(404).json({ erro: 'Resenha não encontrada' })
	};
	resenhas.splice(id - 1, 1);
	res.status(204).send();
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

/*

http://localhost:3000/livros

{
        "nome": "Carmilla",
        "autor": "Sheridan Le Fanu",
        "idioma_original": "Inglês",
        "editora": "Editora pandorga",
        "edicao": "2021",
        "data_publicacao": "1872",
        "resumo": "jfbjWEFHEBFHF"
    },
    {
        "nome": "Crepúsculo",
        "autor": "Stephenie Meyer",
        "idioma_original": "Inglês",
        "editora": "Intrínseca",
        "edicao": "26 de mar. 2008; Português",
        "data_publicacao": "27 de set. 2005",
        "resumo": "Isabella Swan"
    }

http://localhost:3000/livros/1/resenhas

{
        "livroId": 1,
        "titulo": "Lésbicas?",
        "avaliacao": "5 estrelas",
        "data_postagem": "29/10/2025",
        "descricao": "Estou em confusão, me sentindo traída e iludida! Passei o livro inteiro toda a leitura me deleitando no romance sáfico e esperando uma aventura noturna entre as personagens principais e isso  não ocorreu em nenhum momento. Não irei mentir, me senti roubada sobre as maravilhas que poderiam ter acontecido nessa união, mas é um ótimo livro"
    }

http://localhost:3000/livros/2/resenhas

{
        "livroId": 2,
        "titulo": "Opiniões",
        "avaliacao": "3.5 estrelas",
        "data_postagem": "29/10/2025",
        "descricao": "O Edward é um otário, a Bela uma sonsa e o JAcob um gostoso( apesar de meio pedófilo )"
    },
    {
        "livroId": 2,
        "titulo": "ulala",
        "avaliacao": "5 estrelas",
        "data_postagem": "29/10/2025",
        "descricao": "O romance entre a protagonista Bella Swan e o interesse amoroso, Edward Cullen, é construído de forma interessante e realista. O Edward é um vampiro telepata de 109 anos preso no corpo de um adolescente de 17 e encontra a Bella, que chama a sua atenção e se torna um porto seguro e calmo, diferente de todos os outros humanos em sua vida. A trama é muito bem construída e inclui detalhes sobre os conflitos internos dos vampiros com a caça pela comida e as diferentes filosofias dessa espécie intrigante. Recomendo muito esse livro se você se interessar por enredos complexos que mudarão sua visão de vida"
    }


*/