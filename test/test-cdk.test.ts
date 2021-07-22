import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as TestCdk from '../lib/test-cdk-stack';

// If you were to perform unit tests this is where you put these framework pieces...
test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TestCdk.TestCdkStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
