import connect from '@lettercms/utils/lib/connection';
import * as accounts from '@lettercms/models/accounts';
import usage from '@lettercms/models/usages';

export default async function(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({
      status: 'method-not-allowed'
    });

  await connect();

  const {body} = req;
  const {subdomain} = body;

  const invitation = await accounts.Invitations.exists({
    email: body.email
  });

  if (!invitation)
    return res.json({
      status: 'not-invited',
      messages: 'Collaborator not invited'
    });

  await accounts.Accounts.createCollab(subdomain, {
    ...body,
    role: 'collaborator'
  });

  await accounts.Invitations.updateOne({
    subdomain,
    email: body.email
  }, {
    status: 'accepted'
  });

  await usage.updateOne({subdomain}, {$inc: {accountsCollabs: 1}});

  res.json({
    status: 'OK'
  });
};
