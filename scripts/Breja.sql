-- DROP TABLE clientes;


CREATE TABLE IF NOT EXISTS Usuarios
(
    idUsuario SERIAL NOT NULL,
    cpf VARCHAR NOT NULL,
    nomeUser VARCHAR(100) NOT NULL,
    emailUser VARCHAR(50) NOT NULL,
    senhaUser VARCHAR NOT NULL,
    funcaoUser VARCHAR(50) NOT NULL,
    telefoneUser VARCHAR NOT NULL,
    dtnascUser DATE NOT NULL,
    constraint pk_usuarios primary key (idUsuario),
    constraint uk_cpf_Usuario unique (cpf),
    constraint uk_email_Usuario unique (emailUser)
);


CREATE TABLE IF NOT EXISTS EmailClientes
(
    idCliente SERIAL NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    constraint pk_EmailClientes primary key (idCliente)
);


CREATE TABLE IF NOT EXISTS EnderecoClientes
(
    idEndereco SERIAL NOT NULL,
    Rua VARCHAR(30) NOT NULL,
    Numero INTEGER NOT NULL,
    Bairro VARCHAR(30) NOT NULL,
    Cidade VARCHAR(30) NOT NULL,
    Estado VARCHAR(2) NOT NULL,
    cep VARCHAR(8) NOT NULL,
    constraint pk_EnderecoClientes primary key (idEndereco)
);

CREATE TABLE IF NOT EXISTS Clientes
(
    idCliente SERIAL NOT NULL,
    cpfCliente VARCHAR NOT NULL,
    nomeCliente VARCHAR(100) NOT NULL,
    emailCliente VARCHAR(50) NOT NULL,
    senhaCliente VARCHAR NOT NULL,
    telefoneCliente VARCHAR NOT NULL,
    dtnascCliente DATE NOT NULL,
    idEndereco INTEGER NOT NULL,
    constraint pk_Clientes primary key (idCliente),
    constraint fk_Clientes_EnderecoClientes foreign key (idEndereco) references EnderecoClientes(IdEndereco),
    constraint uk_cpf_Clientes unique (cpfCliente),
    constraint uk_email_Clientes unique (EmailCliente)
);


CREATE TABLE IF NOT EXISTS Categorias
(
    idCate SERIAL NOT NULL,
    nomeCate VARCHAR(20) NOT NULL,
    constraint pk_Categorias primary key (idCate)
);

CREATE TABLE IF NOT EXISTS Produtos
(
    idProduto SERIAL NOT NULL,
    nomeProduto VARCHAR(30) NOT NULL,
    precoProduto NUMERIC(10,2) NOT NULL,
    idCate INTEGER NOT NULL,
    constraint pk_Produtos primary key (idProduto),
    constraint fk_Produtos_Categorias foreign key (idCate) references Categorias(idCate)
);


CREATE TABLE IF NOT EXISTS Pedidos
(
    idPedido SERIAL NOT NULL,
    dthora DATE NOT NULL,
    estado BOOLEAN NOT NULL,
    idCliente INTEGER NOT NULL,
    constraint pk_Pedidos primary key (idPedido),
    constraint fk_Pedidos_Clientes foreign key (idCliente) references Clientes(idCliente)
);


CREATE TABLE IF NOT EXISTS Possui
(
    idPedido INTEGER NOT NULL,  
    idProduto INTEGER NOT NULL,
    qde INTEGER NOT NULL,
    constraint pk_Pedidos_Possui primary key (idPedido, idProduto),
    constraint fk_Possui_Pedidos foreign key (idPedido) references Pedidos(idPedido),
    constraint fk_Possui_Produtos foreign key (idProduto) references Produtos(idProduto)
);

CREATE TABLE IF NOT EXISTS Pertence
(
    idCate INTEGER NOT NULL,  
    idProduto INTEGER NOT NULL,
    qde INTEGER NOT NULL,
    constraint pk_Pedidos_Pertence primary key (idCate, idProduto),
    constraint fk_Pertence_Pedidos foreign key (idCate) references Categorias(idCate),
    constraint fk_Pertence_Produtos foreign key (idProduto) references Produtos(idProduto)
);



--INSERTIONs


insert into Categorias (nomeCate) values ('Cervejas'),
                                        ('Vinhos'),
                                        ('Destilhados'),
                                        ('Não Alcolicas'),
                                       ;



INSERT INTO Produtos (nomeProduto, precoProduto, idCate) VALUES ('Heineken', 10.00 , 1),
                                                                ('Stella Artois ', 10.00 , 1) ,  
                                                                ('Ipa Artesanal', 15.00 , 1),   
                                                                ('Pilsen Nacional', 15.00 , 1),    
                                                                ('Lager Importado', 15.00 , 1)
                                                                ;   


INSERT INTO Produtos (nomeProduto, precoProduto, idCate) VALUES ('Cabernet Sauvignon', 80.00 , 2),
                                                                ('Chardonnay ', 80.00 , 2) ,  
                                                                ('Vinho verde', 80.00 , 2),   
                                                                ('Prosecco', 80.00 , 2),    
                                                                ('Rosé francês ', 150.00 , 2)
                                                                ;   

INSERT INTO Produtos (nomeProduto, precoProduto, idCate) VALUES ('Jhonny Walker Black Label', 90.00 , 3),
                                                                ('Absolute Vodka ', 40.00 , 3) ,  
                                                                ('Tanqueray Gin ', 50.00 , 3),   
                                                                ('Havana Club Rum', 40.00 , 3),    
                                                                ('Petron Tequila  ', 60.00 , 3)
                                                                ;            


INSERT INTO Produtos (nomeProduto, precoProduto, idCate) VALUES ('Coca Cola', 10.00 , 4),
                                                                ('Suco de Laranja', 5.00 , 4) ,  
                                                                ('Agua Mineral ', 5.00 , 4),   
                                                                ('Tônica ', 10.00 , 4),    
                                                                ('Sprite', 10.00 , 4)
                                                                ;                                                                   
                                                                                                                                                                         
