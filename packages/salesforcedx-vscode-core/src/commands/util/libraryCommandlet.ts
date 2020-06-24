/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { Connection } from '@salesforce/core';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { nls } from '../../messages';
import { TelemetryData, telemetryService } from '../../telemetry';
import { OrgAuthInfo } from '../../util';
import { CommandletExecutor } from './sfdxCommandlet';

export abstract class LibraryCommandletExecutor<T>
  implements CommandletExecutor<T> {
  protected showChannelOutput = true;
  protected executionName: string = '';
  protected startTime: [number, number] | undefined;
  protected telemetryName: string | undefined;

  public build(execName: string, telemetryLogName: string) {}

  public execute(response: ContinueResponse<T>): void {}

  public logMetric() {
    telemetryService.sendCommandEvent(this.telemetryName, this.startTime);
  }

  public setStartTime() {
    this.startTime = process.hrtime();
  }

  protected getTelemetryData(
    success: boolean,
    response: ContinueResponse<T>,
    output: string
  ): TelemetryData | undefined {
    return;
  }

  public async initalizeConnection(): Promise<Connection> {
    const usernameOrAlias = await OrgAuthInfo.getDefaultUsernameOrAlias(true);
    if (!usernameOrAlias) {
      throw new Error(nls.localize('error_no_default_username'));
    }
    const conn = await OrgAuthInfo.getConnection(usernameOrAlias);
    return conn;
  }
}
