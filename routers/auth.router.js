const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 패스워드를 해시로 변환
    const hashPassword = await bcrypt.hash(password, 10);

    // Sequelize를 사용하여 유저 생성
    const newUser = await User.create({
      username,
      password: hashPassword,
    });

    res.json({
      message: "회원가입이 완료되었습니다.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "회원가입 중 오류가 발생했습니다." });
  }
});

// 로그인 API
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 사용자가 존재하는지 확인
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 일치 여부 확인
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 생성
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 사용자 정보 조회 API
router.get('/me', async (req, res) => {
  try {
    // req.locals.user에는 미들웨어에서 설정한 사용자 정보가 담겨 있음
    const user = req.locals.user;

    res.status(200).json({ userId: user.id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
