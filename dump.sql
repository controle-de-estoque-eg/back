create database pdv;

CREATE TABLE roles (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  soft_delete BOOLEAN default false
);

CREATE TABLE categorias (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP,
 soft_delete BOOLEAN default false
);

CREATE TABLE fornecedores (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone INT NOT NULL,
  documento INT ,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  soft_delete BOOLEAN default false
);

CREATE TABLE movimento_estoque (
  id serial primary key,
  data_entrada DATE NOT NULL,
  numero_nota INT,
  valor_total FLOAT,
  descricao VARCHAR(255),
  tipo VARCHAR(255),
  fornecedor_id INT NOT NULL REFERENCES fornecedores(id),
  soft_delete BOOLEAN default false
);

CREATE TABLE formas_pagamento (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  soft_delete BOOLEAN default false
);

CREATE TABLE venda_formas_pagamento (
  id serial primary key,
  venda_id INT ,
  form_pagamento_id INT NOT NULL REFERENCES formas_pagamento(id),
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

insert into usuarios (email,senha) 
values('adm@hotmail.com',"adm123")

CREATE TABLE vendas (
  id serial primary key,
  cliente_id INT NOT NULL REFERENCES clientes(id),
  valor_total INT NOT NULL,
  tipo_pagamento INT NOT NULL REFERENCES venda_formas_pagamento(id),
  parcelamento INT NOT NULL ,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  concluida BOOLEAN ,
  desconto INT,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP  ,
  soft_delete BOOLEAN default false
);

alter table venda_formas_pagamento add constraint fk_venda_id foreign key (venda_id) references vendas(id);

CREATE TABLE produtos (
  id serial primary key,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  categoria_id INT REFERENCES categorias(id),
  fornecedor_id INT ,
  imagem varchar(255),
  historico_custo_id INT,
  historico_venda_id INT,
  quantidade_estoque INT NOT NULL ,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  disponivel BOOLEAN ,
  codigo_de_barras INT ,
  soft_delete BOOLEAN default false
);

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
  soft_delete BOOLEAN default false
);

alter table produtos add constraint fk_fornecedor_id foreign key (fornecedor_id) references produtos_fornecedores(id);

CREATE TABLE historico_custo (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  valor FLOAT,
  update_at TIMESTAMP,
  soft_delete BOOLEAN default false
);

alter table produtos add constraint fk_historico_custo_id foreign key (historico_custo_id) references historico_custo(id);

CREATE TABLE historico_venda (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  valor FLOAT,
  update_at TIMESTAMP,
  soft_delete BOOLEAN default false
);

alter table produtos add constraint fk_historico_venda_id foreign key (historico_venda_id) references historico_venda(id);

CREATE TABLE produto_movimento_estoque (
  id serial primary key,
  produto_id INT REFERENCES produtos(id),
  movimento_estoque_id INT REFERENCES movimento_estoque(id),
  custo FLOAT,
  quantidade INT,
  soft_delete BOOLEAN default false
);





