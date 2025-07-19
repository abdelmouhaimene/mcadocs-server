import { Module } from '@nestjs/common';
import { AuhtModule } from './auth/auht.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuhtModule, UserModule, BookmarkModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
