create database pdv;

CREATE TABLE roles (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  soft_delete BOOLEAN default false
);

INSERT INTO roles (nome)
VALUES ('SUDO'),("ADMIN"),('USER');

CREATE TABLE categorias (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP,
  soft_delete BOOLEAN default false
);

INSERT INTO categorias(nome,descricao, create_at) 
VALUES ('Camisas','Todo tipo de Camisas','2024-03-14 14:50:53.875'),
('Calças','Todo tipo de Calças','2024-03-14 14:50:53.875'),
('Linhas','Todo tipo de Linha','2024-03-14 14:50:53.875'),
('Tintas','Todo tipo de Tinta','2024-03-14 14:50:53.875'),
('Brinquedos','Todo tipo de Brinquedo','2024-03-14 14:50:53.875');

CREATE TABLE fornecedores (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone INT NOT NULL,
  documento INT,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  soft_delete BOOLEAN default false
);
INSERT INTO fornecedores(nome,email,telefone,documento,create_at)
INSERT INTO fornecedores(nome,email,telefone,documento,create_at)
VALUES ('Fornecedor 1','fornecedor1@email.com','33225164',334569,'2024-03-14 14:50:53.875'),
('Fornecedor 2','fornecedor2@email.com','33251124',698215,'2024-03-14 14:50:53.875'),
('Fornecedor 3','fornecedor3@email.com','33125164',5698765,'2024-03-14 14:50:53.875');


CREATE TABLE movimento_estoque (
  id serial primary key,
  data_entrada DATE NOT NULL,
  numero_nota INT,
  valor_total NUMERIC(12, 2),
  descricao VARCHAR(255),
  tipo VARCHAR(255),
  fornecedor_id INT NOT NULL REFERENCES fornecedores(id),
  soft_delete BOOLEAN default false
);

CREATE TABLE formas_pagamento (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  soft_delete BOOLEAN default false
);

CREATE TABLE clientes (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf varchar(11),
  cep varchar(9),
  rua varchar(255),
  numero integer,
  bairro varchar(255),
  cidade varchar(255),
  estado varchar(255),
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  soft_delete BOOLEAN default false
);

CREATE TABLE usuarios (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id),
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  soft_delete BOOLEAN default false
);

INSERT INTO usuarios (nome,email,role_id,senha,create_at)
VALUES ('SUDO','sudo@email.com','1', '$2b$10$Fdq4J23HLUd1cqiQ0BbTU.BV8Rcqu0AnQ7Wm4tHojQzeO81UVB59y','2024-03-14 14:50:53.875'),
('adm','adm@email.com','2', '$2b$10$Fdq4J23HLUd1cqiQ0BbTU.BV8Rcqu0AnQ7Wm4tHojQzeO81UVB59y','2024-03-14 14:50:53.875'),
('user','user@email.com','3', '$2b$10$Fdq4J23HLUd1cqiQ0BbTU.BV8Rcqu0AnQ7Wm4tHojQzeO81UVB59y','2024-03-14 14:50:53.875');

CREATE TABLE vendas (
  id serial primary key,
  cliente_id INT NOT NULL REFERENCES clientes(id),
  valor_total NUMERIC(12, 2) NOT NULL,
  parcelamento INT NOT NULL,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  concluida BOOLEAN,
  desconto INT,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP,
  update_at TIMESTAMP,
  soft_delete BOOLEAN DEFAULT false
);


CREATE TABLE vendas_formas_pagamento (
  id serial primary key,
  venda_id INT NOT NULL REFERENCES vendas(id),
  forma_pagamento_id INT NOT NULL REFERENCES formas_pagamento(id),
  valor_pago NUMERIC(12, 2) NOT NULL,
  create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP,
  update_at TIMESTAMP,
  soft_delete BOOLEAN DEFAULT false
);

CREATE TABLE produtos (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  categoria_id INT REFERENCES categorias(id),
  imagem varchar(255),
  valor_custo NUMERIC(12, 2) ,
  valor_venda NUMERIC(12, 2) ,
  quantidade_estoque INT ,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  disponivel BOOLEAN default false,
  codigo_de_barras INT ,
  soft_delete BOOLEAN default false
);

INSERT INTO produtos(nome,descricao,categoria_id,imagem,valor_custo,valor_venda,quantidade_estoque,create_at,disponivel,codigo_de_barras)
VALUES ('Camisa Masculina GG','Camisa Masculina Tamanho GG cor Vermelha',1,'',3,4,5,'2024-03-14 14:50:53.875',true,123),
('Calça Masculina GG','Calça Masculina Tamanho GG cor Vermelha',2,'',3,4,5,'2024-03-14 14:50:53.875',true,321);

CREATE TABLE vendas_produtos (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  venda_id INT REFERENCES vendas(id),
  quantidade_produto INT,
  valor_produto INT,
  desconto INT,
  soft_delete BOOLEAN default false
);

CREATE TABLE produtos_fornecedores (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  fornecedor_id INT REFERENCES fornecedores(id),
  soft_delete BOOLEAN default false,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP 
);

CREATE TABLE historico_custo (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  valor_custo NUMERIC(12, 2),
  update_at TIMESTAMP,
  soft_delete BOOLEAN default false
);

CREATE TABLE historico_venda (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  valor_venda NUMERIC(12, 2),
  update_at TIMESTAMP,
  soft_delete BOOLEAN default false
);

CREATE TABLE produto_movimento_estoque (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  movimento_estoque_id INT REFERENCES movimento_estoque(id),
  custo FLOAT,
  quantidade INT,
  soft_delete BOOLEAN default false
);





