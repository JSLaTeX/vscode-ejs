import { execaCommandSync as exec } from 'execa';
import { chProjectDir, rmDist, copyPackageFiles } from 'lion-system';

chProjectDir(import.meta.url);
rmDist();
exec('tsc');
exec('tsc-alias');
copyPackageFiles();
