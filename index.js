const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("build"));

morgan.token("body", (request) => {
	if (request.method === "POST") {
		return JSON.stringify(request.body);
	}
	return "";
});

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);
	person ? response.json(person) : response.status(404).end();
});

app.get("/info", (request, response) => {
	let numPeople = persons.length;
	const getDate = new Date();
	response.send(`
        <div>
            <p>Phonebook has info for ${numPeople} people</p>
            <p>${getDate}</p>
        </div>
    `);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

const generateId = () => {
	const newId = Math.floor(Math.random() * 1000);

	return String(newId);
};

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "You haven't entered a name or number.",
		});
	}
	const nameExists = persons.some((person) => person.name === body.name);
	if (nameExists) {
		return response.status(400).json({
			error: "Name already exists in the phonebook.",
		});
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	response.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
