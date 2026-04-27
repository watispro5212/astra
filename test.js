const { REST, Routes } = require('discord.js');
const { config } = require('./src/core/config.ts');
const fs = require('fs');
require('ts-node/register');
const { AI_MODELS } = require('./src/services/aiService.ts');
// just test the choices
console.log(AI_MODELS);
