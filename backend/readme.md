## **Endpoints**

### **GET /books**
Retorna todos os livros.

### **GET /books?userId=1&filter=my**
Retorna os livros do usuário.

### **GET /books?userId=1&filter=available**
Retorna livros disponíveis para o usuário.

### **POST /books/**
Cria um novo livro.

**Parâmetros:**
- `ownerId` (obrigatório): ID do dono.
- `title` (obrigatório): Título.
- `author` (obrigatório): Autor.
- `edition` (opcional): Edição.
- `preservation` (opcional): Estado de conservação.

### **PUT /books/**
Atualiza um livro.

**Parâmetros:**
- `bookId` (obrigatório): ID do livro.
- `ownerId` (obrigatório): ID do dono.
- `title`, `author`, `edition`, `preservation` (opcionais).

### **DELETE /books/**
Deleta um livro.

**Parâmetro:**
- `bookId` (obrigatório): ID do livro.

