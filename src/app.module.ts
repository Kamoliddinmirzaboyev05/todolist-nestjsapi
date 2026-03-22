import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaService } from './prisma/prisma.service';

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    PrismaModule,
    TodosModule,
    AdminModule.createAdminAsync({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => {
        // Prisma 5 compatibility hack for older @adminjs/prisma
        if (!(prisma as any)._baseDmmf) {
          (prisma as any)._baseDmmf = { datamodelEnumMap: {} };
        }
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: {
                  model: {
                    ...(prisma as any)._runtimeDataModel.models.Todo,
                    name: 'Todo',
                  },
                  client: prisma,
                },
                options: {
                  navigation: { name: 'Management', icon: 'Task' },
                },
              },
            ],
          },
          auth: {
            authenticate: async (email, password) => {
              const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
              const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
              if (email === adminEmail && password === adminPassword) {
                return { email: adminEmail };
              }
              return null;
            },
            cookieName: 'adminjs',
            cookiePassword: 'super-secret-password-used-to-encrypt-cookies',
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
