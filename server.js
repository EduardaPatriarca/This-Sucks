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

app.get('resenhas/:id', (req, res) => {
	const id = parseInt(req.params.id);
	const resenha = resenhas[id - 1];
	if (resenha) {
		res.send(resenha);
	} else {
		res.send('Resenha não encontrada');
	}
});

app.delete('resenhas/:id', (req, res) => {
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