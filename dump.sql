create database pdv;


CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP 
);

CREATE TABLE fornecedores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone INT NOT NULL,
  documento INT NOT NULL,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP 
);

CREATE TABLE movimento_estoque (
  id SERIAL PRIMARY KEY,
  data_entrada DATE NOT NULL,
  descricao VARCHAR(255),
  tipo VARCHAR(255),
  fornecedor_id INT NOT NULL REFERENCES fornecedores(id)
);

CREATE TABLE formas_pagamento (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

CREATE TABLE venda_formas_pagamento (
  id SERIAL PRIMARY KEY,
  venda_id INT ,
  form_pagamento_id INT NOT NULL REFERENCES formas_pagamento(id)
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role_id INT NOT NULL REFERENCES roles(id),
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP 
);

CREATE TABLE vendas (
  id SERIAL PRIMARY KEY,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  cliente_id INT NOT NULL REFERENCES clientes(id),
  valor_total INT NOT NULL,
  tipo_pagamento INT NOT NULL REFERENCES venda_formas_pagamento(id),
  parcelamento INT NOT NULL ,
  usuario_id INT NOT NULL REFERENCES usuarios(id),
  concluida BOOLEAN ,
  desconto INT 
);

alter table venda_formas_pagamento add constraint fk_venda_id foreign key (venda_id) references vendas(id);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  categoria_id INT REFERENCES categorias(id),
  fornecedor_id INT ,
  historico_custo_id INT,
  historico_venda_id INT,
  quantidade_estoque INT NOT NULL ,
  create_at TIMESTAMP NOT NULL,
  delete_at TIMESTAMP ,
  update_at TIMESTAMP ,
  disponivel BOOLEAN ,
  codigo_de_barras INT 
);

CREATE TABLE vendas_produtos (
  id SERIAL PRIMARY KEY,
  produto_id INT REFERENCES produtos(id),
  venda_id INT REFERENCES vendas(id),
  quantidade_produto INT,
  valor_produto INT,
  desconto INT
);

CREATE TABLE produtos_fornecedores (
  id SERIAL PRIMARY KEY,
  produto_id INT REFERENCES produtos(id),
  fornecedor_id INT REFERENCES fornecedores(id)
);

alter table produtos add constraint fk_fornecedor_id foreign key (fornecedor_id) references produtos_fornecedores(id);

CREATE TABLE historico_custo (
  id SERIAL PRIMARY KEY,
  produto_id INT REFERENCES produtos(id),
  valor FLOAT,
  update_at TIMESTAMP
);

alter table produtos add constraint fk_historico_custo_id foreign key (historico_custo_id) references historico_custo(id);

CREATE TABLE historico_venda (
  id SERIAL PRIMARY KEY,
  produto_id INT REFERENCES produtos(id),
  valor FLOAT,
  update_at TIMESTAMP
);

alter table produtos add constraint fk_historico_venda_id foreign key (historico_venda_id) references historico_venda(id);

CREATE TABLE produto_movimento_estoque (
  id SERIAL PRIMARY KEY,
  produto_id INT REFERENCES produtos(id),
  movimento_estoque_id INT REFERENCES movimento_estoque(id),
  custo FLOAT,
  quantidade INT
);