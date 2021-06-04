import express from 'express';
import createError from 'http-errors';
import productModel from './schema.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res, next) => {
  try {
    const products = await productModel.find();
    res.send(products);
  } catch (error) {
    console.log(error);
  }
});
productRouter.get('/:id', async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (product) {
      res.send(product);
    } else {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});
productRouter.post('/', async (req, res, next) => {
  try {
    const newProduct = new productModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
  }
});
productRouter.put('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
});
productRouter.delete('/:id', async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

// -------------REVIEWS PART----------------//

productRouter.get('/:id/reviews/', async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id, {
      reviews: 1,
      _id: 0,
    });
    if (product) {
      res.send(product.reviews);
    } else {
      next(createError(404, `Blog with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while getting reviews'));
  }
});

productRouter.get('/:id/reviews/:commentId', async (req, res, next) => {
  try {
    const product = await productModel.findOne(
      {
        _id: req.params.id,
      },
      {
        reviews: {
          $elemMatch: { _id: req.params.commentId },
        },
      }
    );
    if (product) {
      const { reviews } = product;
      if (reviews && reviews.length > 0) {
        res.send(reviews[0]);
      } else {
        next(
          createError(
            404,
            `Comment with id: ${req.params.commentId} not found in this blog`
          )
        );
      }
    } else {
      next(createError(404, `Blog with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while looking for reviews'));
  }
});
productRouter.post('/:id/reviews/', async (req, res, next) => {
  try {
    const comment = req.body.NewComment;
    const commentToInsert = { ...comment, date: new Date() };
    const updatePost = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: commentToInsert,
        },
      },
      { runValidators: true, new: true }
    );
    if (updatePost) {
      res.send(updatePost);
    } else {
      next(createError(404, `Post with id ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while posting update'));
  }
});

productRouter.put('/:id/reviews/:commentId', async (req, res, next) => {
  try {
    const product = await productModel.findOneAndUpdate(
      {
        _id: req.params.id,
        'reviews._id': req.params.commentId,
      },

      { $set: { 'reviews.$': req.body } },
      {
        runValidators: true,
        new: true,
      }
    );
    if (product) {
      res.send(product);
    } else {
      next(createError(404, `Blog with id:${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while updating reviews'));
  }
});
productRouter.delete('/:id/reviews/:commentId', async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          reviews: { _id: req.params.commentId },
        },
      },
      {
        new: true,
      }
    );
    if (product) {
      res.send(product);
    } else {
      next(createError(404, `Blog with id: ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'An error while deleting comment'));
  }
});

export default productRouter;
