<?php

require "db-conf.php";

$db->query("
  CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (128) NOT NULL
  );
");

$db->query("
  CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    name VARCHAR (128) NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
  );
");

$db->query("
  CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season INT NOT NULL,
    player_1_id INT NOT NULL,
    player_2_id INT NOT NULL,
    FOREIGN KEY (player_1_id) REFERENCES players(id),
    FOREIGN KEY (player_2_id) REFERENCES players(id)
  );
");