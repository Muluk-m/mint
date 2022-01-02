import React from 'react';
import catchComponentError from './catchCompnentsError';

interface ErrorInfoType {
  ttUrl?: string;
  owners?: Array<{ uid: string; mis: string }>;
}

export default ({
  ttUrl = 'https://tt.sankuai.com/ticket/create?cid=155&tid=2659&iid=20214',
  owners
}: ErrorInfoType = {}) =>
  catchComponentError({
    errMessage: '',
    level: 'error',
    info: (
      <div style={{ textAlign: 'center', lineHeight: '2', marginTop: '10%' }}>
        <h3 style={{ lineHeight: '5' }}>页面异常，影响到您的使用我们深表歉意</h3>
        <div>
          您可以
          <a href={ttUrl} target='_blank' rel='noopener noreferrer'>
            点此提交TT
          </a>
          ，我们将全力火速解决
        </div>
        <div>
          也可以联系管理员(mis:
          {Array.isArray(owners) ? (
            owners.map(({ uid, mis }) => (
              <a
                key={uid}
                href={`https://x.sankuai.com/bridge/chat?uid=${uid}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {mis}
              </a>
            ))
          ) : (
            <>
              <a
                href='https://x.sankuai.com/bridge/chat?uid=1932503808'
                target='_blank'
                rel='noopener noreferrer'
              >
                wb_maqiqian
              </a>
              ,
              <a
                href='https://x.sankuai.com/bridge/chat?uid=2165086328'
                target='_blank'
                rel='noopener noreferrer'
              >
                wanghongchao05
              </a>
              ,
            </>
          )}
          )
        </div>
      </div>
    )
  });
