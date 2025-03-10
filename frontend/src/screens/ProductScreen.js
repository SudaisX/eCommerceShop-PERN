import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap';
import commaNumber from 'comma-number';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = ({ history, match }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [qty, setQty] = useState(1);

    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const { success: successProductReview, error: errorProductReview } = productReviewCreate;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (successProductReview) {
            alert('Review Submitted!');
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(listProductDetails(match.params.id));
    }, [dispatch, match, successProductReview]);

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            createProductReview(match.params.id, {
                rating,
                comment,
            })
        );
    };

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                {'< Go Back'}
            </Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
                    <Meta title={product.name} />
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={7}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating
                                        value={product.rating}
                                        text={` ${product.numReviews} reviews`}
                                    />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={2}>Price</Col>
                                        <Col>
                                            <strong>₨{commaNumber(product.price)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={2}>Status</Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={2}>Description</Col>
                                        <Col>{product.description}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col
                                                md={2}
                                                style={{ display: 'flex', alignItems: 'center' }}>
                                                Quantity{' '}
                                            </Col>
                                            <Col md={3}>
                                                <Form.Select
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}>
                                                    {[...Array(product.countInStock).keys()].map(
                                                        (n) => (
                                                            <option key={n + 1} value={n + 1}>
                                                                {n + 1}
                                                            </option>
                                                        )
                                                    )}
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <Row className='mt-3'>
                                            <Col md={5}>
                                                <Button
                                                    onClick={addToCartHandler}
                                                    className='btn-block'
                                                    variant='primary'
                                                    style={{ width: '100%' }}
                                                    disabled={product.countInStock === 0}>
                                                    Add to Cart
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Col>
                        {/* <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>₨{product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.countInStock > 0
                                                    ? 'In Stock'
                                                    : 'Out of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Select
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}>
                                                        {[
                                                            ...Array(product.countInStock).keys(),
                                                        ].map((n) => (
                                                            <option key={n + 1} value={n + 1}>
                                                                {n + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button
                                            onClick={addToCartHandler}
                                            className='btn-block'
                                            variant='primary'
                                            style={{ width: '100%' }}
                                            disabled={product.countInStock === 0}>
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col> */}
                    </Row>
                    <Row className='mt-3'>
                        <hr />
                        <Col>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {errorProductReview && (
                                        <Message variant='danger'>{errorProductReview}</Message>
                                    )}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}>
                                                    <option value=''>Select..</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) =>
                                                        setComment(e.target.value)
                                                    }></Form.Control>
                                            </Form.Group>
                                            <Button
                                                type='submit'
                                                variant='primary'
                                                className='mt-3'>
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Message>
                                            <Link to='/login'>Sign In</Link> to leave a Review
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={1}></Col>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && (
                                <Message variant='danger'>No Reviews</Message>
                            )}

                            <ListGroup variant='flush'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ProductScreen;
