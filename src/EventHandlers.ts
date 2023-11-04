import {
  MainnetpoapContract_EventToken_loader,
  MainnetpoapContract_EventToken_handler,
  MainnetpoapContract_Transfer_loader,
  MainnetpoapContract_Transfer_handler,
  GnosispoapContract_EventToken_handler,
  GnosispoapContract_EventToken_loader,
  GnosispoapContract_Transfer_handler,
  GnosispoapContract_Transfer_loader,
} from "../generated/src/Handlers.gen";

import {
  // AccountEntity,
  // TokenEntity,
  // EventEntity,
  // TransferEntity,
} from "../generated/src/Types.gen";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

MainnetpoapContract_EventToken_loader(({ event, context }) => {
  // loading the required entity
  context.Event.load(event.params.eventId.toString());
  context.Token.load(event.params.tokenId.toString(), {
    loaders: { loadEvent: true }
  });
});

MainnetpoapContract_EventToken_handler(({ event, context }) => {
  let event_ = context.Event.get(event.params.eventId.toString());
  let token = context.Token.get(event.params.tokenId.toString())!;

  if (!event_) {
    event_ = {
      id: event.params.eventId.toString(),
      tokenCount: 0n,
      tokenMints: 0n,
      transferCount: 0n,
      created: BigInt(event.blockTimestamp),
    };
    context.Event.set(event_);
  } else {
    event_ = {
      ...event_,
      tokenCount: event_.tokenCount + 1n,
      tokenMints: event_.tokenMints + 1n,
      transferCount: event_.transferCount + 1n
    };
    context.Event.set(event_);
  }
  token = {
    ...token,
    event: event_.id,
    mintOrder: event_.tokenMints
  };
  context.Token.set(token);

});

MainnetpoapContract_Transfer_loader(({ event, context }) => {
  // loading the required  entity
  context.Account.load(event.params.from.toString());
  context.Account.load(event.params.to.toString());
  context.Token.load(event.params.tokenId.toString(), {
    loaders: { loadEvent: true, loadOwner: true }
  });
});

MainnetpoapContract_Transfer_handler(({ event, context }) => {
  let from = context.Account.get(event.params.from.toString());
  let to = context.Account.get(event.params.to.toString());
  let token = context.Token.get(event.params.tokenId.toString());


  if (!from) {
    from = {
      id: event.params.from.toString(),
      // The from account at least has to own one token
      tokensOwned: 1n
    };
    context.Account.set(from);
  }
  // Don't subtracts from the ZERO_ADDRESS (it's the one that mint the token)
  // Avoid negative values
  if (from.id != ZERO_ADDRESS) {
    from = {
      ...from,
      tokensOwned: from.tokensOwned - 1n
    };
    context.Account.set(from);
  }
  if (!to) {
    to = {
      id: event.params.to.toString(),
      tokensOwned: 0n
    };
    context.Account.set(to);
  } else {
    to = {
      ...to,
      tokensOwned: to.tokensOwned + 1n
    };
    context.Account.set(to);
  }
  if (!token) {
    token = {
      id: event.params.tokenId.toString(),
      transferCount: 0n,
      created: BigInt(event.blockTimestamp),
      owner: to.id,
      event: null,
      mintOrder: 0n
    };
    context.Token.set(token);

  } else {
    token = {
      ...token,
      transferCount: token.transferCount! + 1n
    };
    context.Token.set(token);
  }

  if (token.event != null) {
    let event_ = context.Token.getEvent(token);

    if (event_ != null) {
      // Add one transfer
      event_ = {
        ...event_,
        transferCount: event_.transferCount + 1n
      };
      context.Event.set(event_);

      // Burning the token
      if (to.id == ZERO_ADDRESS) {
        event_ = {
          ...event_,
          tokenCount: event_.tokenCount - 1n,
          transferCount: event_.transferCount - token.transferCount
        };
        context.Event.set(event_);
      }
    }
  }



  let transferid = event.blockNumber.toString().concat('-').concat(event.logIndex.toString());
  context.Transfer.set({
    id: transferid,
    token: token!.id,
    from: from!.id,
    to: to!.id,
    transaction: event.transactionHash,
    timestamp: BigInt(event.blockTimestamp),
  });

});


GnosispoapContract_EventToken_loader(({ event, context }) => {
  // loading the required entity
  context.Event.load(event.params.eventId.toString());
  context.Token.load(event.params.tokenId.toString(), {
    loaders: { loadEvent: true }
  });
});

GnosispoapContract_EventToken_handler(({ event, context }) => {
  let event_ = context.Event.get(event.params.eventId.toString());
  let token = context.Token.get(event.params.tokenId.toString())!;

  if (!event_) {
    event_ = {
      id: event.params.eventId.toString(),
      tokenCount: 0n,
      tokenMints: 0n,
      transferCount: 0n,
      created: BigInt(event.blockTimestamp),
    };
    context.Event.set(event_);
  } else {
    event_ = {
      ...event_,
      tokenCount: event_.tokenCount + 1n,
      tokenMints: event_.tokenMints + 1n,
      transferCount: event_.transferCount + 1n
    };
    context.Event.set(event_);
  }
  token = {
    ...token,
    event: event_.id,
    mintOrder: event_.tokenMints
  };
  context.Token.set(token);

});

GnosispoapContract_Transfer_loader(({ event, context }) => {
  // loading the required  entity
  context.Account.load(event.params.from.toString());
  context.Account.load(event.params.to.toString());
  context.Token.load(event.params.tokenId.toString(), {
    loaders: { loadEvent: true, loadOwner: true }
  });
});

GnosispoapContract_Transfer_handler(({ event, context }) => {
  let from = context.Account.get(event.params.from.toString());
  let to = context.Account.get(event.params.to.toString());
  let token = context.Token.get(event.params.tokenId.toString());
  // let event_ = context.Token.getEvent(token);

  if (!from) {
    from = {
      id: event.params.from.toString(),
      // The from account at least has to own one token
      tokensOwned: 1n
    };
    context.Account.set(from);
  }
  // Don't subtracts from the ZERO_ADDRESS (it's the one that mint the token)
  // Avoid negative values
  if (from.id != ZERO_ADDRESS) {
    from = {
      ...from,
      tokensOwned: from.tokensOwned - 1n
    };
    context.Account.set(from);
  }
  if (!to) {
    to = {
      id: event.params.to.toString(),
      tokensOwned: 0n
    };
    context.Account.set(to);
  } else {
    to = {
      ...to,
      tokensOwned: to.tokensOwned + 1n
    };
    context.Account.set(to);
  }
  if (!token) {
    token = {
      id: event.params.tokenId.toString(),
      transferCount: 0n,
      created: BigInt(event.blockTimestamp),
      owner: to.id,
      event: null,
      mintOrder: 0n
    };
    context.Token.set(token);

  } else {
    token = {
      ...token,
      transferCount: token.transferCount! + 1n
    };
    context.Token.set(token);
  }

  if (token.event != null) {
    let event_ = context.Token.getEvent(token);

    if (event_ != null) {
      // Add one transfer
      event_ = {
        ...event_,
        transferCount: event_.transferCount + 1n
      };
      context.Event.set(event_);

      // Burning the token
      if (to.id == ZERO_ADDRESS) {
        event_ = {
          ...event_,
          tokenCount: event_.tokenCount - 1n,
          transferCount: event_.transferCount - token.transferCount
        };
        context.Event.set(event_);
      }
    }
  }

  let transferid = event.blockNumber.toString().concat('-').concat(event.logIndex.toString());
  context.Transfer.set({
    id: transferid,
    token: token!.id,
    from: from!.id,
    to: to!.id,
    transaction: event.transactionHash,
    timestamp: BigInt(event.blockTimestamp),
  });

});
