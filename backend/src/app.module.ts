import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AdminModule } from './modules/admin/admin.module';
import { SuperAdminModule } from './modules/superadmin/superadmin.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CoursesModule,
    EnrollmentsModule,
    PaymentsModule,
    SubscriptionsModule,
    AdminModule,
    SuperAdminModule,
  ],
})
export class AppModule {}
