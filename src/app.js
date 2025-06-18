const express = require('express');
const app = express();
const PORT = 5000;
app.use(express.json());
const shoppingList = [];
let nextId = 1;

app.post('/items', (req, res) => {
    const { name, quantity, type } = req.body;

    if (!name || typeof name !== 'string' || !quantity || typeof quantity !== 'number' || quantity <= 0 || !type || typeof type !== 'string') {
        console.log('Dados inválidos recebidos para POST /items:', req.body);
        return res.status(422).send({ message: "Todos os campos (name, quantity, type) são obrigatórios e devem ser válidos (quantity deve ser um número inteiro positivo)." });
    }

    const lowerCaseName = name.toLowerCase();
    const existingItem = shoppingList.find(item => item.name.toLowerCase() === lowerCaseName);

    if (existingItem) {
        console.log('Conflito: Item com o mesmo nome já existe:', name);
        return res.status(409).send({ message: `Um item com o nome '${name}' já existe na lista.` });
    }

    const newItem = {
        id: nextId++,
        name,
        quantity,
        type,
    };

    shoppingList.push(newItem);

    console.log('Item adicionado com sucesso:', newItem);
    res.status(201).json(newItem);
});

app.get('/items', (req, res) => {
    const typeFilter = req.query.type;

    if (typeFilter) {
        const lowerCaseTypeFilter = typeFilter.toLowerCase();
        const filteredList = shoppingList.filter(item => item.type.toLowerCase() === lowerCaseTypeFilter);
        console.log(`Consulta de itens por tipo '${typeFilter}':`, filteredList);
        return res.status(200).json(filteredList);
    }

    console.log('Consulta de todos os itens:', shoppingList);
    res.status(200).json(shoppingList);
});

app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId) || itemId <= 0) {
        console.log('Requisição inválida: ID não é um número inteiro positivo:', req.params.id);
        return res.status(400).send({ message: "O ID deve ser um número inteiro positivo." });
    }

    const foundItem = shoppingList.find(item => item.id === itemId);

    if (!foundItem) {
        console.log('Não encontrado: Item com ID não existe:', itemId);
        return res.status(404).send({ message: `Item com ID ${itemId} não encontrado.` });
    }

    console.log('Item encontrado por ID:', foundItem);
    res.status(200).json(foundItem);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});