import { GenerationOptionsResponse } from '@core/models/generation-options.model';

export const defaultGenerationOptions: GenerationOptionsResponse = {
  templates: [
    {
      id: 'node-basic-js',
      name: 'Node.js Starter (JavaScript)',
      description: 'Lean starter for Node.js services and scripts in JavaScript.',
      category: 'Starter',
      tree: [
        {
          label: 'src',
          icon: 'pi pi-folder',
          children: [{ label: 'index.js', icon: 'pi pi-file' }],
        },
        { label: 'public', icon: 'pi pi-folder' },
        { label: 'package.json', icon: 'pi pi-file' },
        { label: 'README.md', icon: 'pi pi-file' },
        { label: '.env.example', icon: 'pi pi-file' },
        { label: '.gitignore', icon: 'pi pi-file' },
        { label: 'LICENSE', icon: 'pi pi-file' },
      ],
    },
    {
      id: 'express-api-ts',
      name: 'Express API (TypeScript)',
      description: 'REST API structure with Express + TypeScript, ready to scale.',
      category: 'Backend API',
      tree: [
        {
          label: 'src',
          icon: 'pi pi-folder',
          children: [
            { label: 'app.ts', icon: 'pi pi-file' },
            { label: 'server.ts', icon: 'pi pi-file' },
            {
              label: 'routes',
              icon: 'pi pi-folder',
              children: [{ label: 'health.route.ts', icon: 'pi pi-file' }],
            },
          ],
        },
        { label: 'public', icon: 'pi pi-folder' },
        { label: 'package.json', icon: 'pi pi-file' },
        { label: 'tsconfig.json', icon: 'pi pi-file' },
        { label: 'README.md', icon: 'pi pi-file' },
        { label: '.env.example', icon: 'pi pi-file' },
        { label: '.gitignore', icon: 'pi pi-file' },
        { label: 'LICENSE', icon: 'pi pi-file' },
      ],
    },
    {
      id: 'fastify-api-ts',
      name: 'Fastify API (TypeScript)',
      description:
        'High-performance API with Fastify + TypeScript and healthcheck route.',
      category: 'Backend API',
      tree: [
        {
          label: 'src',
          icon: 'pi pi-folder',
          children: [{ label: 'server.ts', icon: 'pi pi-file' }],
        },
        { label: 'public', icon: 'pi pi-folder' },
        { label: 'package.json', icon: 'pi pi-file' },
        { label: 'tsconfig.json', icon: 'pi pi-file' },
        { label: 'README.md', icon: 'pi pi-file' },
        { label: '.env.example', icon: 'pi pi-file' },
        { label: '.gitignore', icon: 'pi pi-file' },
        { label: 'LICENSE', icon: 'pi pi-file' },
      ],
    },
    {
      id: 'cli-tool-ts',
      name: 'CLI Tool (TypeScript)',
      description:
        'CLI foundation with TypeScript and a ready-to-use executable entry point.',
      category: 'Tooling',
      tree: [
        {
          label: 'src',
          icon: 'pi pi-folder',
          children: [{ label: 'index.ts', icon: 'pi pi-file' }],
        },
        { label: 'public', icon: 'pi pi-folder' },
        { label: 'package.json', icon: 'pi pi-file' },
        { label: 'tsconfig.json', icon: 'pi pi-file' },
        { label: 'README.md', icon: 'pi pi-file' },
        { label: '.env.example', icon: 'pi pi-file' },
        { label: '.gitignore', icon: 'pi pi-file' },
        { label: 'LICENSE', icon: 'pi pi-file' },
      ],
    },
    {
      id: 'worker-scheduler-js',
      name: 'Worker/Scheduler (JavaScript)',
      description: 'Template for jobs, queues, and scheduled routines in Node.js.',
      category: 'Workers',
      tree: [
        {
          label: 'src',
          icon: 'pi pi-folder',
          children: [{ label: 'worker.js', icon: 'pi pi-file' }],
        },
        { label: 'public', icon: 'pi pi-folder' },
        { label: 'package.json', icon: 'pi pi-file' },
        { label: 'README.md', icon: 'pi pi-file' },
        { label: '.env.example', icon: 'pi pi-file' },
        { label: '.gitignore', icon: 'pi pi-file' },
        { label: 'LICENSE', icon: 'pi pi-file' },
      ],
    },
  ],
  presets: [
    {
      id: 'saas-api',
      name: 'SaaS API',
      description:
        'Opinionated stack for SaaS product APIs with auth and relational database.',
      templateId: 'express-api-ts',
      recommendedLibraries: [
        'express',
        'cors',
        'helmet',
        'morgan',
        'dotenv',
        'jsonwebtoken',
        'bcrypt',
        'prisma',
        'pg',
        'joi',
      ],
    },
    {
      id: 'public-api',
      name: 'Public API',
      description:
        'Preset for public APIs with baseline protection, docs, and observability.',
      templateId: 'express-api-ts',
      recommendedLibraries: [
        'express',
        'cors',
        'helmet',
        'morgan',
        'express-rate-limit',
        'swagger-ui-express',
        'swagger-jsdoc',
        'dotenv',
      ],
    },
    {
      id: 'microservice-events',
      name: 'Microservice Events',
      description:
        'Foundation for event-driven microservices with messaging and tracing.',
      templateId: 'fastify-api-ts',
      recommendedLibraries: [
        'fastify',
        'amqplib',
        'dotenv',
        'pino',
        'uuid',
        '@opentelemetry/api',
      ],
    },
    {
      id: 'cli-automation',
      name: 'CLI Automation',
      description: 'Preset for terminal-based automation and internal tooling.',
      templateId: 'cli-tool-ts',
      recommendedLibraries: ['commander', 'chalk', 'dotenv', 'axios', 'yargs'],
    },
    {
      id: 'scheduler-worker',
      name: 'Scheduler / Worker',
      description: 'Preset focused on asynchronous processing and recurring jobs.',
      templateId: 'worker-scheduler-js',
      recommendedLibraries: ['bull', 'redis', 'node-schedule', 'dotenv', 'pino'],
    },
    {
      id: 'web-scraping',
      name: 'Web Scraping',
      description: 'Preset for data collection, scraping, and HTTP integration routines.',
      templateId: 'node-basic-js',
      recommendedLibraries: ['axios', 'cheerio', 'dotenv', 'date-fns'],
    },
  ],
};
