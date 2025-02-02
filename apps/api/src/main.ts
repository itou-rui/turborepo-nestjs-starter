import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any;
async function bootstrap() {
  const logger = new Logger('EntryPoint');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Leaves Tracker')
    .setDescription('Api Docs for leaves tracker')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT || 5002;
  const HOSTNAME = process.env.HOSTNAME || 'localhost';

  await app.listen(PORT, HOSTNAME);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  logger.log(`Server running on http://${HOSTNAME}:${PORT}`);
}
bootstrap();
